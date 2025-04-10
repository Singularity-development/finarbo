import { ClassConstructor, plainToInstance } from 'class-transformer';

export abstract class Mapper {
  static mapToDto<I, O>(
    value: I | I[] | Record<string, I>,
    cls: ClassConstructor<O>,
  ): O | O[] | Record<string, O> {
    if (Array.isArray(value)) {
      return value.map((item) => this.deepTransform(item, cls));
    }

    if (typeof value === 'object' && value !== null) {
      return this.deepTransform(value, cls);
    }

    throw new Error('Invalid input: Expected an array or object.');
  }

  static mapToRecordDto<I, O>(
    value: Record<string, I>,
    cls: ClassConstructor<O>,
  ): Record<string, O> {
    if (Array.isArray(value)) {
      throw new Error('Invalid input: Expected an record.');
    }

    if (typeof value === 'object' && value !== null) {
      return Object.entries(value).reduce(
        (acc, [key, item]) => {
          acc[key] = this.deepTransform(item, cls);
          return acc;
        },
        {} as Record<string, O>,
      );
    }

    throw new Error('Invalid input: Expected an record.');
  }

  private static deepTransform<I, O>(value: I, cls: ClassConstructor<O>): O {
    return plainToInstance(cls, value, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true, // Allows automatic conversion of nested objects
    });
  }
}
