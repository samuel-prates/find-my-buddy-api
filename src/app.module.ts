import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { DatabaseModule } from './infrastructure/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './infrastructure/entities/user.entity';
import { SearchForEntity } from './infrastructure/entities/search-for.entity';
import { TypeOrmUserRepository } from './infrastructure/repositories/user.repository';
import { TypeOrmSearchForRepository } from './infrastructure/repositories/search-for.repository';
import { USER_REPOSITORY, SEARCH_FOR_REPOSITORY } from './domain/ports/injection-tokens';
import { UserController } from './presentation/controllers/user.controller';
import { SearchForController } from './presentation/controllers/search-for.controller';
import { HttpExceptionFilter } from './presentation/filters/http-exception.filter';

// User use cases
import { CreateUserUseCase } from './application/use-cases/user/create-user.use-case';
import { GetAllUsersUseCase } from './application/use-cases/user/get-all-users.use-case';
import { GetUserByIdUseCase } from './application/use-cases/user/get-user-by-id.use-case';
import { UpdateUserUseCase } from './application/use-cases/user/update-user.use-case';
import { DeleteUserUseCase } from './application/use-cases/user/delete-user.use-case';

// SearchFor use cases
import { CreateSearchForUseCase } from './application/use-cases/search-for/create-search-for.use-case';
import { GetAllSearchForUseCase } from './application/use-cases/search-for/get-all-search-for.use-case';
import { GetSearchForByIdUseCase } from './application/use-cases/search-for/get-search-for-by-id.use-case';
import { UpdateSearchForUseCase } from './application/use-cases/search-for/update-search-for.use-case';
import { DeleteSearchForUseCase } from './application/use-cases/search-for/delete-search-for.use-case';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([UserEntity, SearchForEntity]),
  ],
  controllers: [UserController, SearchForController],
  providers: [
    // Global exception filter
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    
    // Repositories
    {
      provide: USER_REPOSITORY,
      useClass: TypeOrmUserRepository,
    },
    {
      provide: SEARCH_FOR_REPOSITORY,
      useClass: TypeOrmSearchForRepository,
    },
    
    // User use cases
    CreateUserUseCase,
    GetAllUsersUseCase,
    GetUserByIdUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    
    // SearchFor use cases
    CreateSearchForUseCase,
    GetAllSearchForUseCase,
    GetSearchForByIdUseCase,
    UpdateSearchForUseCase,
    DeleteSearchForUseCase,
  ],
})
export class AppModule {}