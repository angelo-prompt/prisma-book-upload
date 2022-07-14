/*
  Warnings:

  - You are about to drop the column `titlee` on the `Book` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title]` on the table `Book` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `title` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Book_titlee_key";

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "titlee",
ADD COLUMN     "title" VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Book_title_key" ON "Book"("title");
