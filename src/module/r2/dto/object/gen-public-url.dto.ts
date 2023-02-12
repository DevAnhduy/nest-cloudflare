import { Transform } from 'class-transformer';
import { isEmpty, IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';

import { MAX_EXPIRE_TIME_PUBLIC_URL } from '@common/constant/_common';
import { trim } from '@common/helpers/string';
import { LengthValidator } from '@common/validators';
import { BetweenValidator } from '@common/validators/between.validator';

export class GenPublicUrlDto {
  @Transform((params) => trim(params.value))
  @IsNotEmpty({
    message: 'The [key] must not be left empty.',
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

  @IsOptional()
  @ValidateIf((_object, value) => !isEmpty(value))
  @BetweenValidator(0, MAX_EXPIRE_TIME_PUBLIC_URL, {
    message: `[expire_time] must have a minimum of 1 second and a maximum of ${MAX_EXPIRE_TIME_PUBLIC_URL} second`,
  })
  expire_time: number;
}
