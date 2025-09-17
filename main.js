import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js'
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  orderBy
} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js'

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDGYnq4VKq-YGu4RbfoI_ZHez9fishYjZo",
  authDomain: "insan-cemerlang-afd2f.firebaseapp.com",
  projectId: "insan-cemerlang-afd2f",
  storageBucket: "insan-cemerlang-afd2f.appspot.com",
  messagingSenderId: "686649580589",
  appId: "1:686649580589:web:61374bbbd68adb604eaca4",
  measurementId: "G-LNZTQBCE26"
};

// Inisialisasi Firebase
const aplikasi = initializeApp(firebaseConfig)
const basisdata = getFirestore(aplikasi)

// Fungsi untuk mendapatkan daftar barang
export async function ambilDaftarBarang() {
  const refDokumen = collection(basisdata, "aplikasi_umkm");
  const kueri = query(refDokumen, orderBy("nama"));
  const cuplikanKueri = await getDocs(kueri);
  
  let hasilKueri = [];
  cuplikanKueri.forEach((dokumen) => {
    hasilKueri.push({
      id: dokumen.id,
      nama: dokumen.data().nama,
      harga: dokumen.data().harga,
      stok: dokumen.data().stok
    })
  })
  
  return hasilKueri;
}

// Fungsi untuk menambah barang
export async function tambahBarang(nama, harga, stok) {
  try {
    const refDokumen = await addDoc(collection(basisdata, "aplikasi_umkm"), {
      nama: nama,
      harga: harga,
      stok: stok
    })
    
    console.log('Berhasil menyimpan data barang')
    return true;
  } catch (error) {
    console.log('Gagal menyimpan data barang: ' + error)
    return false;
  }
}

// Fungsi untuk menghapus barang
export async function hapusBarang(id) {
  try {
    await deleteDoc(doc(basisdata, "aplikasi_umkm", id))
    console.log('Berhasil menghapus data barang')
    return true;
  } catch (error) {
    console.log('Gagal menghapus data barang: ' + error)
    return false;
  }
}

// Fungsi untuk mengubah barang
export async function ubahBarang(id, namabaru, hargabaru, stokbaru) {
  try {
    await updateDoc(
      doc(basisdata, "aplikasi_umkm", id), { nama: namabaru, harga: hargabaru, stok: stokbaru }
    )
    console.log('Berhasil mengubah data barang')
    return true;
  } catch (error) {
    console.log('Gagal mengubah data barang: ' + error)
    return false;
  }
}

// Fungsi untuk mendapatkan detail barang
export async function ambilBarang(id) {
  try {
    const refDokumen = doc(basisdata, "aplikasi_umkm", id)
    const snapshotDokumen = await getDoc(refDokumen)
    
    if (snapshotDokumen.exists()) {
      return {
        id: snapshotDokumen.id,
        nama: snapshotDokumen.data().nama,
        harga: snapshotDokumen.data().harga,
        stok: snapshotDokumen.data().stok
      };
    } else {
      console.log("Dokumen tidak ditemukan");
      return null;
    }
  } catch (error) {
    console.log('Error mengambil data barang: ' + error)
    return null;
  }
}

// Fungsi untuk keranjang belanja
export function kelolaKeranjang() {
  let keranjang = JSON.parse(localStorage.getItem('keranjang')) || [];
  
  return {
    tambahKeKeranjang: function(barang, jumlah) {
      const existingItem = keranjang.find(item => item.id === barang.id);
      
      if (existingItem) {
        existingItem.jumlah += jumlah;
        existingItem.total = existingItem.harga * existingItem.jumlah;
      } else {
        keranjang.push({
          id: barang.id,
          nama: barang.nama,
          harga: barang.harga,
          jumlah: jumlah,
          total: barang.harga * jumlah
        });
      }
      
      localStorage.setItem('keranjang', JSON.stringify(keranjang));
      return true;
    },
    
    hapusDariKeranjang: function(id) {
      keranjang = keranjang.filter(item => item.id !== id);
      localStorage.setItem('keranjang', JSON.stringify(keranjang));
      return true;
    },
    
    updateKeranjang: function(id, jumlah) {
      const item = keranjang.find(item => item.id === id);
      if (item) {
        item.jumlah = jumlah;
        item.total = item.harga * jumlah;
        localStorage.setItem('keranjang', JSON.stringify(keranjang));
        return true;
      }
      return false;
    },
    
    dapatkanKeranjang: function() {
      return keranjang;
    },
    
    bersihkanKeranjang: function() {
      keranjang = [];
      localStorage.setItem('keranjang', JSON.stringify(keranjang));
      return true;
    },
    
    totalKeranjang: function() {
      return keranjang.reduce((total, item) => total + item.total, 0);
    }
  };
}