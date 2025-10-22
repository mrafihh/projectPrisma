-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `username` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `nama` VARCHAR(255) NOT NULL,
    `role` ENUM('ADMIN', 'KARYAWAN') NOT NULL DEFAULT 'KARYAWAN',
    `aktif` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_username_key`(`username`),
    INDEX `users_email_idx`(`email`),
    INDEX `users_username_idx`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `id` VARCHAR(191) NOT NULL,
    `kodeBarang` VARCHAR(100) NOT NULL,
    `namaBarang` VARCHAR(255) NOT NULL,
    `deskripsi` TEXT NULL,
    `kategori` VARCHAR(100) NOT NULL,
    `satuan` VARCHAR(50) NOT NULL,
    `stokMinimal` INTEGER NOT NULL DEFAULT 10,
    `stokSaatIni` INTEGER NOT NULL DEFAULT 0,
    `hargaBeli` DECIMAL(15, 2) NOT NULL,
    `hargaJual` DECIMAL(15, 2) NOT NULL,
    `lokasi` VARCHAR(255) NULL,
    `gambar` VARCHAR(500) NULL,
    `aktif` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `products_kodeBarang_key`(`kodeBarang`),
    INDEX `products_kodeBarang_idx`(`kodeBarang`),
    INDEX `products_kategori_idx`(`kategori`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transactions` (
    `id` VARCHAR(191) NOT NULL,
    `nomorTransaksi` VARCHAR(100) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `tipeTransaksi` ENUM('MASUK', 'KELUAR') NOT NULL,
    `jumlah` INTEGER NOT NULL,
    `harga` DECIMAL(15, 2) NOT NULL,
    `totalHarga` DECIMAL(15, 2) NOT NULL,
    `pihakTerkait` VARCHAR(255) NULL,
    `tanggal` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `keterangan` TEXT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `transactions_nomorTransaksi_key`(`nomorTransaksi`),
    INDEX `transactions_productId_idx`(`productId`),
    INDEX `transactions_userId_idx`(`userId`),
    INDEX `transactions_tanggal_idx`(`tanggal`),
    INDEX `transactions_tipeTransaksi_idx`(`tipeTransaksi`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `laporan_stoks` (
    `id` VARCHAR(191) NOT NULL,
    `bulan` INTEGER NOT NULL,
    `tahun` INTEGER NOT NULL,
    `totalBarang` INTEGER NOT NULL,
    `totalNilai` DECIMAL(15, 2) NOT NULL,
    `dataLaporan` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `laporan_stoks_tahun_bulan_idx`(`tahun`, `bulan`),
    UNIQUE INDEX `laporan_stoks_bulan_tahun_key`(`bulan`, `tahun`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifikasis` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `pesan` TEXT NOT NULL,
    `dibaca` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `notifikasis_productId_idx`(`productId`),
    INDEX `notifikasis_dibaca_idx`(`dibaca`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
