import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

import { trim } from '@common/helpers/string';
import { LengthValidator } from '@common/validators';

export class DeleteObjectDto {
  @Transform((params) => trim(params.value))
  @IsNotEmpty({
    message: 'The [key] must not be left empty.',
  })
  @LengthValidator(1, 1024, {
    message: 'The key [key] length must be between 1 to 1024 characters.',
  })
  key: string;

  @Transform((params) => trim(params.value))
  @IsNotEmpty({
    message: 'The [bucket_name] must not be left empty.',
  })
  @LengthValidator(3, 63, {
    message: '[bucket_name] length must be between 3 to 63 characters.',
  })
  bucket_name: string;
}
