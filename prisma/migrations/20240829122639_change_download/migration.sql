/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `DownloadVerification` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DownloadVerification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL DEFAULT '',
    "productId" TEXT NOT NULL,
    CONSTRAINT "DownloadVerification_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_DownloadVerification" ("createdAt", "id", "productId") SELECT "createdAt", "id", "productId" FROM "DownloadVerification";
DROP TABLE "DownloadVerification";
ALTER TABLE "new_DownloadVerification" RENAME TO "DownloadVerification";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
