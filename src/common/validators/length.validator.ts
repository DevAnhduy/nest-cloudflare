import { registerDecorator, ValidationOptions } from 'class-validator';

export function LengthValidator(
  min: number,
  max: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string): any {
    registerDecorator({
      name: 'lengthValidator',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (value) {
            if (typeof value === 'string' || value instanceof String) {
              return value.length >= min && value.length <= max;
            }

            return true;
          }

          return true;
        },
      },
    });
  };
}
