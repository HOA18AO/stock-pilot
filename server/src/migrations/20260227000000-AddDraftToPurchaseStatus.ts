import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDraftToPurchaseStatus20260227000000 implements MigrationInterface {
  name = 'AddDraftToPurchaseStatus20260227000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TYPE "public"."purchase_status_enum" ADD VALUE IF NOT EXISTS 'draft'`);
  }

  public async down(): Promise<void> {
    // PostgreSQL does not support dropping enum values directly.
  }
}
