import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { GetAllSearchForUseCase } from '../../application/use-cases/search-for/get-all-search-for.use-case';
import { GetSearchForByIdUseCase } from '../../application/use-cases/search-for/get-search-for-by-id.use-case';
import { CreateSearchForUseCase } from '../../application/use-cases/search-for/create-search-for.use-case';
import { UpdateSearchForUseCase } from '../../application/use-cases/search-for/update-search-for.use-case';
import { DeleteSearchForUseCase } from '../../application/use-cases/search-for/delete-search-for.use-case';
import { CreateSearchForDto } from '../dtos/search-for/create-search-for.dto';
import { UpdateSearchForDto } from '../dtos/search-for/update-search-for.dto';
import { SearchForResponseDto } from '../dtos/search-for/search-for-response.dto';
import { SearchForType } from '../../domain/entities/search-for.entity';

@ApiTags('search-for')
@Controller('search-for')
export class SearchForController {
  constructor(
    private readonly getAllSearchForUseCase: GetAllSearchForUseCase,
    private readonly getSearchForByIdUseCase: GetSearchForByIdUseCase,
    private readonly createSearchForUseCase: CreateSearchForUseCase,
    private readonly updateSearchForUseCase: UpdateSearchForUseCase,
    private readonly deleteSearchForUseCase: DeleteSearchForUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new search item' })
  @ApiResponse({ status: 201, description: 'Search item created successfully', type: SearchForResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async createSearchFor(@Body() createSearchForDto: CreateSearchForDto): Promise<SearchForResponseDto> {
    const searchFor = await this.createSearchForUseCase.execute(createSearchForDto);
    return SearchForResponseDto.fromEntity(searchFor);
  }

  @Get()
  @ApiOperation({ summary: 'Get all search items' })
  @ApiResponse({ status: 200, description: 'List of search items', type: [SearchForResponseDto] })
  @ApiQuery({ name: 'type', enum: SearchForType, required: false, description: 'Filter by type (Person or Animal)' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter by user ID' })
  async getAllSearchFor(
    @Query('type') type?: SearchForType,
    @Query('userId') userId?: string,
  ): Promise<SearchForResponseDto[]> {
    // For now, we'll just return all search items
    // In a future implementation, we could add filtering by type and userId
    const searchFors = await this.getAllSearchForUseCase.execute();
    return SearchForResponseDto.fromEntities(searchFors);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a search item by ID' })
  @ApiParam({ name: 'id', description: 'Search item ID' })
  @ApiResponse({ status: 200, description: 'Search item found', type: SearchForResponseDto })
  @ApiResponse({ status: 404, description: 'Search item not found' })
  async getSearchForById(@Param('id') id: string): Promise<SearchForResponseDto> {
    const searchFor = await this.getSearchForByIdUseCase.execute(id);
    return SearchForResponseDto.fromEntity(searchFor);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a search item' })
  @ApiParam({ name: 'id', description: 'Search item ID' })
  @ApiResponse({ status: 200, description: 'Search item updated successfully', type: SearchForResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Search item not found' })
  async updateSearchFor(
    @Param('id') id: string,
    @Body() updateSearchForDto: UpdateSearchForDto,
  ): Promise<SearchForResponseDto> {
    const searchFor = await this.updateSearchForUseCase.execute(id, updateSearchForDto);
    return SearchForResponseDto.fromEntity(searchFor);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a search item' })
  @ApiParam({ name: 'id', description: 'Search item ID' })
  @ApiResponse({ status: 204, description: 'Search item deleted successfully' })
  @ApiResponse({ status: 404, description: 'Search item not found' })
  async deleteSearchFor(@Param('id') id: string): Promise<void> {
    await this.deleteSearchForUseCase.execute(id);
  }
}