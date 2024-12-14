import { ValidationPipe } from './validation.pipe';
import { ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

jest.mock('class-validator');

describe('ValidationPipe', () => {
  let pipe: ValidationPipe;

  beforeEach(() => {
    pipe = new ValidationPipe();
  });

  describe('transform', () => {
    const mockArgumentMetadata: ArgumentMetadata = { type: 'body', metatype: class TestDto {} };

    class TestDto {
      field1: string;
      field2: number;
    }

    it('should return the value if metatype is not a custom class', async () => {
      const value = 'some value';
      const metadata: ArgumentMetadata = { type: 'body', metatype: String };

      const result = await pipe.transform(value, metadata);

      expect(result).toBe(value);
    });

    it('should validate and return transformed object if validation succeeds', async () => {
      const value = { field1: 'valid', field2: 123 };
      const transformedValue = plainToInstance(TestDto, value);

      (validate as jest.Mock).mockResolvedValue([]);

      const result = await pipe.transform(value, {
        ...mockArgumentMetadata,
        metatype: TestDto,
      });

      expect(validate).toHaveBeenCalledWith(transformedValue);
      expect(result).toEqual(transformedValue);
    });

    it('should throw BadRequestException if validation fails', async () => {
      const value = { field1: null, field2: 'invalid' };
      const transformedValue = plainToInstance(TestDto, value);

      const mockValidationErrors = [
        {
          property: 'field1',
          constraints: { isNotEmpty: 'field1 should not be empty' },
        },
        {
          property: 'field2',
          constraints: { isNumber: 'field2 must be a number' },
        },
      ];

      (validate as jest.Mock).mockResolvedValue(mockValidationErrors);

      await expect(pipe.transform(value, { ...mockArgumentMetadata, metatype: TestDto })).rejects.toThrow(
        new BadRequestException(
          mockValidationErrors.map((err) => ({
            property: err.property,
            constraints: err.constraints,
          })),
        ),
      );

      expect(validate).toHaveBeenCalledWith(transformedValue);
    });
  });

  describe('isCustomClass', () => {
    it('should return false for primitive types', () => {
      const primitives = [String, Boolean, Number, Array, Object];
      primitives.forEach((type) => {
        expect((pipe as any).isCustomClass(type)).toBe(false);
      });
    });

    it('should return true for custom classes', () => {
      class CustomClass {}
      expect((pipe as any).isCustomClass(CustomClass)).toBe(true);
    });
  });
});
