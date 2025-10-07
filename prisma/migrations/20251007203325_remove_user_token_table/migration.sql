/*
  Warnings:

  - You are about to drop the `userToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "userToken";
PRAGMA foreign_keys=on;
