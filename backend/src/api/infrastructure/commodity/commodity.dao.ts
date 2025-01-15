import { DataSource, In, Like, MoreThanOrEqual, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Commodity } from '@/api/domain/commodity/commodity.entity';
import { CommodityAdapter } from './commodity.adapter';
import { CommodityPo } from './commodity.po';
import { CommodityPageDto } from '@/api/application/commodity/commodity.dto';

@Injectable()
export class CommodityDao {
  constructor(
    @InjectRepository(CommodityPo)
    private readonly commodityRepository: Repository<CommodityPo>,
    private readonly commodityAdapter: CommodityAdapter,
    private readonly dataSource: DataSource,
  ) {}

  async Save(commodity: Commodity) {
    const commodityPo = this.commodityAdapter.ToPo(commodity);
    const newCommodityPo = await commodityPo.save();
    return this.commodityAdapter.ToEntity(newCommodityPo);
  }

  async Remove(id: string) {
    await this.commodityRepository.delete({ id });
  }

  async FindOne(id: string) {
    const commodityPo = await this.commodityRepository.findOne({
      where: { id },
    });
    return commodityPo && this.commodityAdapter.ToEntity(commodityPo);
  }

  async FindAll(id?: string, name?: string, date?: Date) {
    const commodityPoList = await this.commodityRepository.find({
      where: { id, name: Like(`%${name || ''}%`), date },
      order: { date: 'ASC' },
    });
    return this.commodityAdapter.ToEntityList(commodityPoList);
  }

  async FindAllByNamesAndDate(names?: string[], date?: Date) {
    const conditions = names?.map((name) => ({
      name: Like(`%${name || ''}%`),
      date,
    }));
    const commodityPoList = await this.commodityRepository.find({
      where: conditions || { date },
      order: { date: 'ASC' },
    });
    return this.commodityAdapter.ToEntityList(commodityPoList);
  }

  async PageAllCommodity(commodityPageDto: CommodityPageDto) {
    const { pageNumber, pageSize, date } = commodityPageDto;
    const [data, total] = await this.commodityRepository.findAndCount({
      where: {
        date,
      },
      order: {
        date: 'DESC',
      },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });
    const commodityList = this.commodityAdapter.ToEntityList(data);
    return {
      commodityList,
      total,
    };
  }

  async FindAllByIds(ids: string[]) {
    const commodityPoList = await this.commodityRepository.find({
      where: { id: In(ids) },
    });
    return this.commodityAdapter.ToEntityList(commodityPoList);
  }

  async FindAllByDate(date: Date) {
    const commodityPoList = await this.commodityRepository.find({
      where: { date: MoreThanOrEqual(date) },
      order: { date: 'ASC' },
    });
    return this.commodityAdapter.ToEntityList(commodityPoList);
  }

  async BatchSave(commodityList: Commodity[]) {
    const commodityPoList = this.commodityAdapter.ToPoList(commodityList);
    const newCommodityPoList = await this.dataSource.transaction(
      async (manager) => {
        return await manager.save(CommodityPo, commodityPoList);
      },
    );
    return this.commodityAdapter.ToEntityList(newCommodityPoList);
  }
}
