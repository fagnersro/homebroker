import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { Wallet } from './entities/wallet.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class WalletsService {
  constructor(@InjectModel(Wallet.name) private WalletSchema: Model<Wallet>) {}

  create(CreateWalletDto: CreateWalletDto) {
    return this.WalletSchema.create(CreateWalletDto);
  }

  findAll() {
    return this.WalletSchema.find();
  }

  findOne(id: string) {
    return this.WalletSchema.findById(id);
  }
}
