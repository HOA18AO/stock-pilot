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
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('invoice')
@ApiBearerAuth()
@Controller('invoice')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Create an invoice' })
  @ApiResponse({ status: 201, description: 'Invoice created' })
  create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoiceService.create(createInvoiceDto);
  }

  @Get()
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'List all invoices' })
  @ApiResponse({ status: 200, description: 'List of invoices' })
  findAll() {
    return this.invoiceService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Get one invoice by id' })
  @ApiResponse({ status: 200, description: 'Invoice' })
  @ApiResponse({ status: 404, description: 'Not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.invoiceService.findOne(id);
  }

  @Patch(':id')
  @Roles('manager')
  @ApiOperation({ summary: 'Update an invoice' })
  @ApiResponse({ status: 200, description: 'Updated invoice' })
  @ApiResponse({ status: 404, description: 'Not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
  ) {
    return this.invoiceService.update(id, updateInvoiceDto);
  }

  @Delete(':id')
  @Roles('manager')
  @ApiOperation({ summary: 'Delete an invoice' })
  @ApiResponse({ status: 200, description: 'Deleted' })
  @ApiResponse({ status: 404, description: 'Not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.invoiceService.remove(id);
  }
}
