/*
  Warnings:

  - You are about to drop the column `refreshToken` on the `userToken` table. All the data in the column will be lost.
  - You are about to drop the column `refreshTokenExpiresDate` on the `userToken` table. All the data in the column will be lost.
  - Added the required column `expiresIn` to the `userToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token` to the `userToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `userToken` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_userToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "expiresIn" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "userToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_userToken" ("createdAt", "id", "userId") SELECT "createdAt", "id", "userId" FROM "userToken";
DROP TABLE "userToken";
ALTER TABLE "new_userToken" RENAME TO "userToken";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
