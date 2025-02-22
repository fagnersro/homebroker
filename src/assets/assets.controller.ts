import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  // Delete,
} from '@nestjs/common';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { AssetPresenter } from './asset.presenter';
// import { UpdateAssetDto } from './dto/update-asset.dto';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post()
  async create(@Body() createAssetDto: CreateAssetDto) {
    const asset = await this.assetsService.create(createAssetDto);
    return new AssetPresenter(asset);
  }

  @Get()
  async findAll() {
    const assets = await this.assetsService.findAll();
    return assets.map((asset) => new AssetPresenter(asset));
  }

  @Get(':symbol')
  async findOne(@Param('symbol') symbol: string) {
    const asset = await this.assetsService.findOne(symbol);
    return new AssetPresenter(asset!);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAssetDto: UpdateAssetDto) {
  //   return this.assetsService.update(+id, updateAssetDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.assetsService.remove(+id);
  // }
}
