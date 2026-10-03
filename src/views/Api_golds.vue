<template>
  <!-- container ของ Bootstrap ใช้จัด layout -->
  <div class="container my-5">

    <!-- หัวข้อ -->
    <h2 class="text-center mb-4">💰 ราคาทองวันนี้</h2>

    <!-- ปุ่มกดเพื่อดึงข้อมูลใหม่ -->
    <div class="text-center mb-3">
      <!-- @click = event เมื่อกดปุ่ม -->
      <button class="btn btn-primary" @click="fetchGold">
        🔄 อัปเดต
      </button>
    </div>

    <!-- ตารางแสดงข้อมูล -->
    <table class="table table-bordered table-striped text-center">

      <!-- ส่วนหัวตาราง -->
      <thead class="table-dark">
        <tr>
          <th>ประเภททอง</th>
          <th>ราคารับซื้อ</th>
          <th>ราคาขายออก</th>
        </tr>
      </thead>

      <!-- ส่วนข้อมูล -->
      <tbody>
        <!-- v-for ใช้วนลูปข้อมูลใน golds -->
        <tr v-for="item in golds" :key="item.name">
          
          <!-- แสดงชื่อทอง -->
          <td>{{ item.name }}</td>

          <!-- แสดงราคาซื้อ (สีเขียว) -->
          <td class="text-success">
            {{ formatNumber(item.buy) }} บาท
          </td>

          <!-- แสดงราคาขาย (สีแดง) -->
          <td class="text-danger">
            {{ formatNumber(item.sell) }} บาท
          </td>

        </tr>
      </tbody>

    </table>

    <!-- ราคาเงิน (Silver) -->
    <h2 class="text-center mt-5 mb-4">🥈 ราคาเงินวันนี้</h2>

    <!-- v-if แสดงตารางเมื่อโหลดข้อมูลเสร็จแล้ว -->
    <table v-if="silver" class="table table-bordered table-striped text-center">
      <thead class="table-dark">
        <tr>
          <th>หน่วย</th>
          <th>ราคา (USD)</th>
          <th>ราคา (บาท)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1 ออนซ์</td>
          <td>${{ formatNumber(silver.usdPerOunce) }}</td>
          <td>{{ formatNumber(silver.usdPerOunce * silver.thbRate) }} บาท</td>
        </tr>
        <tr>
          <td>1 กิโลกรัม</td>
          <td>${{ formatNumber(silver.usdPerOunce * OUNCES_PER_KG) }}</td>
          <td>{{ formatNumber(silver.usdPerOunce * OUNCES_PER_KG * silver.thbRate) }} บาท</td>
        </tr>
      </tbody>
    </table>
    <p v-if="silver" class="text-muted small text-center">
      ราคาตลาดโลก อัตราแลกเปลี่ยน 1 USD = {{ formatNumber(silver.thbRate) }} บาท
    </p>
  </div>
</template>

<script setup>
// import ฟังก์ชันจาก Vue 3
import { ref, onMounted } from 'vue'

// ตัวแปรเก็บข้อมูลราคาทอง (reactive)
const golds = ref([])

// ฟังก์ชันดึงข้อมูล API
const fetchGold = async () => {
  try {
    // เรียก API
    const res = await fetch('https://api.chnwt.dev/thai-gold-api/latest')

    // แปลง response เป็น JSON
    const data = await res.json()

    // เข้าถึงข้อมูล price
    const price = data.response.price

    // แปลงข้อมูลจาก object → array เพื่อใช้กับ v-for
    golds.value = [
      {
        name: "ทองรูปพรรณ",
        // API เป็น string มี comma → ต้องลบ comma แล้วแปลงเป็นตัวเลข
        buy: parseFloat(price.gold.buy.replace(/,/g, "")),
        sell: parseFloat(price.gold.sell.replace(/,/g, ""))
      },
      {
        name: "ทองคำแท่ง",
        buy: parseFloat(price.gold_bar.buy.replace(/,/g, "")),
        sell: parseFloat(price.gold_bar.sell.replace(/,/g, ""))
      }
    ]

  } catch (error) {
    // แสดง error ถ้าโหลดไม่สำเร็จ
    console.error("โหลดข้อมูลผิดพลาด:", error)
  }

  // ดึงราคาเงินไปพร้อมกันเมื่อกดปุ่มอัปเดต
  fetchSilver()
}

// 1 กิโลกรัม = 32.1507 ทรอยออนซ์
const OUNCES_PER_KG = 32.1507

// ตัวแปรเก็บข้อมูลราคาเงิน
const silver = ref(null)

// ฟังก์ชันดึงราคาเงิน
const fetchSilver = async () => {
  try {
    // เรียก 2 API พร้อมกัน: ราคาเงิน (USD ต่อออนซ์) และอัตราแลกเปลี่ยน USD → THB
    const [silverRes, rateRes] = await Promise.all([
      fetch('https://api.gold-api.com/price/XAG'),
      fetch('https://open.er-api.com/v6/latest/USD')
    ])
    const silverData = await silverRes.json()
    const rateData = await rateRes.json()

    silver.value = {
      usdPerOunce: silverData.price,
      thbRate: rateData.rates.THB
    }
  } catch (error) {
    console.error("โหลดราคาเงินผิดพลาด:", error)
  }
}

// ฟังก์ชัน format ตัวเลขให้มี comma (ทศนิยมไม่เกิน 2 ตำแหน่ง)
const formatNumber = (num) => {
  return num.toLocaleString(undefined, { maximumFractionDigits: 2 })
}

// เรียกใช้งานตอน component โหลดเสร็จ
onMounted(fetchGold)
</script>