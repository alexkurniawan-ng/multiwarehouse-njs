import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateWarehouseRequestDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  description: string;
}
