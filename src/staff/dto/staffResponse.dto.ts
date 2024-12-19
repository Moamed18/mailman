import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';

export class StaffResponseDto {

  @Transform((value) => {
    if (value.obj) return value.obj._id.toString();
  })
  @ApiProperty({
    type: String,
    required: true,
    description: 'The unique identifier',
    example: '5f9f9f9f9f9f9f9f9f9f9f9f',
  })
  @Expose()
  _id: string;

  @Expose()
  @ApiProperty({ type: String, required: true })
  email: string;

  @Expose()
  @ApiProperty({
    type: String,
    required: false,
  })
  phoneNumber: string;

  // @Expose()
  // @ApiProperty({ type: String, enum: StaffRole, required: true })
  // role: string;

}

export class StaffPaginationDto {
  @Expose()
  @ApiProperty({ type: Number, default: 4 })
  total: number;
  @Expose()
  @ApiProperty({ type: [StaffResponseDto] })
  @Type(() => StaffResponseDto)
  data: StaffResponseDto[];
}
