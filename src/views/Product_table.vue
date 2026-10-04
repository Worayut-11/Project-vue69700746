<template>
  <!-- container ของ Bootstrap ใช้จัด layout -->
  <div class="container my-5">

    <!-- หัวข้อ -->
    <h2 class="text-center mb-4">🛒 ตารางสินค้า</h2>

    <!-- ปุ่มกดเพื่อดึงข้อมูลใหม่ -->
    <div class="text-center mb-3">
      <!-- @click = event เมื่อกดปุ่ม -->
      <button class="btn btn-primary" @click="fetchProducts">
        🔄 อัปเดต
      </button>
    </div>

    <!-- ตารางแสดงข้อมูล -->
    <table class="table table-bordered table-striped text-center align-middle">

      <!-- ส่วนหัวตาราง -->
      <thead class="table-dark">
        <tr>
          <th>รหัสสินค้า</th>
          <th>รูปภาพ</th>
          <th>ชื่อสินค้า</th>
          <th>รายละเอียด</th>
          <th>จำนวน</th>
          <th>ราคา</th>
          
        </tr>
      </thead>

      <!-- ส่วนข้อมูล -->
      <tbody>
        <!-- v-for ใช้วนลูปข้อมูลใน products -->
        <tr v-for="item in products" :key="item.id">

          <!-- แสดงรหัสสินค้า -->
          <td>{{ item.id }}</td>
                    <!-- แสดงรูปภาพ (ต้องอยู่ใน <td>) -->
          <td>
            <img
              :src="item.thumbnail"
              alt="Product Image"
              style="object-fit: contain; width: 100px; height: 100px"
            />
          </td>

          <!-- แสดงชื่อสินค้า (สีเขียว) -->
          <td class="text-success">
            {{ item.title }}
          </td>
          <td>{{ item.description }}</td>
            <td>{{ item.stock }}</td>

          <!-- แสดงราคา (สีแดง) -->
          <td class="text-danger">
            ${{ item.price }}
          </td>


        </tr>
      </tbody>

    </table>
  </div>
</template>

<script setup>
// import ฟังก์ชันจาก Vue 3
import { ref, onMounted } from 'vue'

// ตัวแปรเก็บข้อมูลสินค้า (reactive)
const products = ref([])

// ฟังก์ชันดึงข้อมูล API
const fetchProducts = async () => {
  try {
    // เรียก API
    const res = await fetch('https://dummyjson.com/products')

    // แปลง response เป็น JSON
    const data = await res.json()

    // dummyjson ส่งข้อมูลมาในรูป { products: [...] }
    products.value = data.products
  } catch (error) {
    // แสดง error ถ้าโหลดไม่สำเร็จ
    console.error("โหลดข้อมูลผิดพลาด:", error)
  }
}

// เรียกใช้งานตอน component โหลดเสร็จ
onMounted(fetchProducts)
</script>
