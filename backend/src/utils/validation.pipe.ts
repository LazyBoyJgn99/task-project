import { strategys } from '@/api/domain/coupon/coupon.entity';
import { NewDate } from './time';
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

/**
 * 自定义日期格式验证器
 * 举例：每年9月8日   每月1日   每周1   每天
 *      YY-09-08    MM-1     WW-1   DD
 */
export function IsCustomDateFormat(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCustomDateFormat',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;

          const regex = /^(YY-\d{1,2}-\d{1,2}|MM-\d{1,2}|WW-\d{1}|DD)$/;

          return regex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must match one of the following formats: "YY-MM-DD", "WW-D", or "DD"`;
        },
      },
    });
  };
}

/**
 * 自定义优惠策略验证器
 * 举例：七折           满100减30
 *      discount-70   full-100-reduce-30
 */
export function IsCustomStrategyFormat(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCustomStrategyFormat',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;

          const passingTimes = strategys.reduce((sum, strategy) => {
            if (strategy.check(value)) {
              return sum + 1;
            } else {
              return sum;
            }
          }, 0);

          return passingTimes > 0;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must match one of the following formats: "discount-70" or "full-100-reduce-30"`;
        },
      },
    });
  };
}

/**
 * 检查日期的真实性
 * @param dateString 日期字符串，格式为 YYYY-MM-DD
 */
function IsValidDate(dateString: string): boolean {
  const [year, month, day] = dateString.split('-').map(Number);

  // 创建日期对象
  const date = NewDate(`${year}-${month - 1}-${day}`);

  // 检查年、月、日是否匹配
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

/**
 * 自定义优惠券使用时间验证器
 * 举例：2024-09-05 to 2024-10-05
 */
export function IsCustomUseTimeFormat(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCustomStrategyFormat',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          // 使用正则表达式验证日期格式
          const regex = /^\d{4}-\d{1,2}-\d{1,2} to \d{4}-\d{1,2}-\d{1,2}$/;

          // 如果格式不匹配，直接返回 false
          if (!regex.test(value)) {
            return false;
          }

          // 分割日期范围
          const [start, end] = value.split(' to ');

          // 验证日期的真实性
          if (!IsValidDate(start) || !IsValidDate(end)) {
            return false;
          }

          // 转换为 Date 对象
          const startDate = new Date(start);
          const endDate = new Date(end);

          // 检查开始日期是否小于结束日期
          return startDate < endDate;
        },

        defaultMessage(args: ValidationArguments) {
          return `${args.property} must match one of the following formats: "2024-09-05 to 2024-10-05"`;
        },
      },
    });
  };
}
