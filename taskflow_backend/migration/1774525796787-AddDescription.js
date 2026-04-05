module.exports = class AddDescription1774525796787 {
    name = 'AddDescription1774525796787'
  
    async up(queryRunner) {
      await queryRunner.query(`ALTER TABLE "tasks" ADD "description" character varying`);
      await queryRunner.query(`ALTER TABLE "tasks" ALTER COLUMN "completed" SET NOT NULL`);
      await queryRunner.query(`ALTER TABLE "tasks" ALTER COLUMN "createdAt" SET NOT NULL`);
    }
  
    async down(queryRunner) {
      await queryRunner.query(`ALTER TABLE "tasks" ALTER COLUMN "createdAt" DROP NOT NULL`);
      await queryRunner.query(`ALTER TABLE "tasks" ALTER COLUMN "completed" DROP NOT NULL`);
      await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "description"`);
    }
  }
