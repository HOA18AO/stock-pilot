import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { WarehouseService } from './warehouse.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('warehouse')
@ApiBearerAuth()
@Controller('warehouse')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Post()
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Create a warehouse' })
  @ApiResponse({ status: 201, description: 'Warehouse created' })
  create(@Body() createWarehouseDto: CreateWarehouseDto) {
    return this.warehouseService.create(createWarehouseDto);
  }

  @Get()
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'List all warehouses' })
  @ApiResponse({ status: 200, description: 'List of warehouses' })
  findAll() {
    return this.warehouseService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Get one warehouse by id' })
  @ApiResponse({ status: 200, description: 'Warehouse' })
  @ApiResponse({ status: 404, description: 'Not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.warehouseService.findOne(id);
  }

  @Patch(':id')
  @Roles('manager')
  @ApiOperation({ summary: 'Update a warehouse' })
  @ApiResponse({ status: 200, description: 'Updated warehouse' })
  @ApiResponse({ status: 404, description: 'Not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWarehouseDto: UpdateWarehouseDto,
  ) {
    return this.warehouseService.update(id, updateWarehouseDto);
  }

  @Delete(':id')
  @Roles('manager')
  @ApiOperation({ summary: 'Delete a warehouse' })
  @ApiResponse({ status: 200, description: 'Deleted' })
  @ApiResponse({ status: 404, description: 'Not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.warehouseService.remove(id);
  }
}
