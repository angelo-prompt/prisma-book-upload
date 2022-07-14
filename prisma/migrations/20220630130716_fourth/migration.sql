/*
  Warnings:

  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Category` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "_BookToCategory" DROP CONSTRAINT "_BookToCategory_B_fkey";

-- AlterTable
ALTER TABLE "Category" DROP CONSTRAINT "Category_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Category_pkey" PRIMARY KEY ("name");

-- AlterTable
ALTER TABLE "_BookToCategory" ALTER COLUMN "B" SET DATA TYPE VARCHAR(255);

-- AddForeignKey
ALTER TABLE "_BookToCategory" ADD CONSTRAINT "_BookToCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "Category"("name") ON DELETE CASCADE ON UPDATE CASCADE;
