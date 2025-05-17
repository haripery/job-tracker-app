import { DataTypes, Model } from 'sequelize';
import { sequelize } from './index';

export class Company extends Model {
  public id!: number;
  public name!: string;
  public role!: string;
  public status!: string;
}

Company.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    role: DataTypes.STRING,
    status: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: 'Company',
    tableName: 'companies',
  }
);
