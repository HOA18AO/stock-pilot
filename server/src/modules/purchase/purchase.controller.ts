import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PurchaseService } from './purchase.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { ReceiveProductsDto } from './dto/receive-purchase-products.dto';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { Roles } from '@modules/auth/decorators/roles.decorator';

@ApiTags('purchase')
@ApiBearerAuth()
@Controller('purchase')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Create a purchase' })
  @ApiResponse({ status: 201, description: 'Purchase created' })
  create(@Body() createPurchaseDto: CreatePurchaseDto) {
    return this.purchaseService.create(createPurchaseDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'List all purchases' })
  @ApiResponse({ status: 200, description: 'List of purchases' })
  findAll() {
    return this.purchaseService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Get a purchase by id' })
  @ApiResponse({ status: 200, description: 'Purchase found' })
  @ApiResponse({ status: 404, description: 'Purchase not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.purchaseService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager')
  @ApiOperation({ summary: 'Update a purchase (manager only)' })
  @ApiResponse({ status: 200, description: 'Purchase updated' })
  @ApiResponse({ status: 404, description: 'Purchase not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePurchaseDto: UpdatePurchaseDto,
  ) {
    return this.purchaseService.update(id, updatePurchaseDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager')
  @ApiOperation({ summary: 'Delete a purchase (manager only)' })
  @ApiResponse({ status: 200, description: 'Purchase deleted' })
  @ApiResponse({ status: 404, description: 'Purchase not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.purchaseService.remove(id);
  }

  @Post(':id/receive')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('staff', 'manager')
  @ApiOperation({ summary: 'Receive products for a purchase (staff/manager)' })
  @ApiResponse({ status: 200, description: 'Products received successfully' })
  @ApiResponse({ status: 400, description: 'Invalid serial codes or quantity mismatch' })
  @ApiResponse({ status: 404, description: 'Purchase not found' })
  receiveProducts(
    @Param('id', ParseIntPipe) id: number,
    @Body() receiveProductsDto: ReceiveProductsDto,
  ) {
    return this.purchaseService.receiveProducts(id, receiveProductsDto);
  }
}
