import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type DepartmentDocument = Department & Document;

@Schema({ timestamps: true, collection: 'departments' })
export class Department {
  @Prop({ required: true, unique: true, uppercase: true, trim: true })
  departmentCode: string;

  @Prop({ required: true, trim: true })
  departmentName: string;

  @Prop({ trim: true })
  departmentNameArabic?: string;

  @Prop()
  description?: string;

  // Hierarchy
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Department' })
  parentDepartmentId?: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Employee' })
  departmentHeadId?: MongooseSchema.Types.ObjectId;

  // Cost Center (for Payroll integration)
  @Prop()
  costCenter?: string;

  // Status
  @Prop({ default: true })
  isActive: boolean;

  @Prop({ required: true })
  effectiveDate: Date;

  @Prop()
  endDate?: Date;

  // Metadata
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  createdBy: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  updatedBy: MongooseSchema.Types.ObjectId;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);

// Indexes
DepartmentSchema.index({ departmentCode: 1 }, { unique: true });
DepartmentSchema.index({ parentDepartmentId: 1 });
DepartmentSchema.index({ departmentHeadId: 1 });
DepartmentSchema.index({ isActive: 1 });
DepartmentSchema.index({ effectiveDate: 1 });

