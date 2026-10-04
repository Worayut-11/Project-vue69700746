<template>
  <!-- Container หลัก -->
  <div class="container my-5">
    <h2 class="text-center mb-4">🛒 สินค้า</h2>

    <!-- แสดงข้อความระหว่างโหลด / เมื่อเกิด error -->
    <p v-if="loading" class="text-center">กำลังโหลดข้อมูล...</p>
    <p v-else-if="error" class="text-center text-danger">{{ error }}</p>

    <div v-else class="row">
      <!-- ใช้ v-for เพื่อวนลูปแสดงสินค้าแต่ละรายการ -->
      <div class="col-md-3 mb-4" v-for="product in products" :key="product.PK">
        <div class="card h-100">
          <!-- แสดงรูปสินค้า -->
          <img
            :src="product.imageName"
            class="card-img-top"
            alt="Product Image"
            style="object-fit: contain; width: 100%; height: 200px"
          />
          <div class="card-body">
            <!-- แสดงชื่อสินค้า -->
            <h5 class="card-title">{{ product.name }}</h5>
          </div>
          <div class="card-footer">
            <!-- แสดงราคาสินค้า -->
            <small class="text-muted">Price: ${{ product.price }}</small>
            &nbsp;
            <!-- ปุ่มสำหรับเพิ่มสินค้า -->
            <button type="button" class="btn btn-outline-primary">Add</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// import ฟังก์ชันจาก Vue 3
import { ref, onMounted } from 'vue'

// URL ของ API สินค้า (เปลี่ยนเป็น API ของอาจารย์/ของตัวเองได้)
const API_URL = 'https://dummyjson.com/products'

// ตัวแปรเก็บข้อมูลสินค้า (reactive)
const products = ref([])
const loading = ref(true)
const error = ref('')

// ฟังก์ชันดึงข้อมูลสินค้าจาก API
const fetchProducts = async () => {
  try {
    const res = await fetch(API_URL)
    const data = await res.json()

    // dummyjson ส่งข้อมูลมาในรูป { products: [...] }
    // แปลงข้อมูลให้ตรงกับชื่อ field ที่ใช้ใน template
    products.value = data.products.map((item) => ({
      PK: item.id,
      name: item.title,
      price: item.price,
      imageName: item.thumbnail
    }))
  } catch (err) {
    console.error('โหลดข้อมูลสินค้าผิดพลาด:', err)
    error.value = 'โหลดข้อมูลสินค้าไม่สำเร็จ'
  } finally {
    loading.value = false
  }
}

// เรียกใช้งานตอน component โหลดเสร็จ
onMounted(fetchProducts)
</script>
