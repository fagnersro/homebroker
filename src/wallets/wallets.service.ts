import { CreateWalletDto } from './dto/create-wallet.dto';
import { Wallet } from './entities/wallet.entity';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { WalletAsset } from './entities/wallet-asset.entity';

@Injectable()
export class WalletsService {
  constructor(
    @InjectModel(Wallet.name) private WalletSchema: Model<Wallet>,
    @InjectModel(WalletAsset.name)
    private walletAssetSchema: Model<WalletAsset>,
    @InjectConnection() private connection: mongoose.Connection,
  ) {}

  create(CreateWalletDto: CreateWalletDto) {
    return this.WalletSchema.create(CreateWalletDto);
  }

  findAll() {
    return this.WalletSchema.find();
  }

  findOne(id: string) {
    return this.WalletSchema.findById(id).populate([
      {
        path: 'assets',
        populate: ['asset'],
      },
    ]);
  }

  async createWalletAsset(data: {
    walletId: string;
    assetId: string;
    shares: number;
  }) {
    const session = await this.connection.startSession();
    await session.startTransaction();

    try {
      const docs = await this.walletAssetSchema.create(
        [
          {
            wallet: data.walletId,
            asset: data.assetId,
            shares: data.shares,
          },
        ],
        { session },
      );
      const walletAsset = docs[0];
      await this.WalletSchema.updateOne(
        { _id: data.walletId },
        {
          $push: { assets: walletAsset._id },
        },
        { session },
      );
      await session.commitTransaction();
      return walletAsset;
    } catch (e) {
      console.error(e);
      await session.abortTransaction();
      throw e;
    } finally {
      await session.endSession();
    }
  }
}
