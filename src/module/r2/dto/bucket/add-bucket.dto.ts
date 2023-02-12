import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

import { trim } from '@common/helpers/string';
import { LengthValidator } from '@common/validators';

export class AddBucketDto {
  @Transform((params) => trim(params.value))
  @IsNotEmpty({
    message: 'The [name] must not be left empty.',
  })
  @LengthValidator(3, 63, {
    message: '[name] length must be between 3 to 63 characters.',
  })
  name: string;
}
