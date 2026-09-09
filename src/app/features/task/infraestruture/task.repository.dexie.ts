import type { TaskRow } from '@app/core/database/schema/task.schema';
import { inject, Service } from '@angular/core';
import type {
  CreateTaskEntity,
  TaskEntity,
  UpdateTaskEntity,
} from '@app/features/task/domine/task.entity';
import type { ITaskRepository } from '@app/features/task/domine/task.repository';
import { liveQuery } from 'dexie';
import { from } from 'rxjs';

import { APP_DB } from '@/app/core/database/db.provider';

function rowToEntity(row: TaskRow): TaskEntity {
  const { categoriaId, tagIds, completeDate, ...rest } = row;
  return { ...rest, categoria: categoriaId, tags: tagIds, completeDate: completeDate ?? '' };
}

function createToRow(body: CreateTaskEntity): Omit<TaskRow, 'id'> {
  const { categoria, tags, ...rest } = body;
  return { ...rest, categoriaId: categoria, tagIds: tags };
}

function updateToRow(body: UpdateTaskEntity): Partial<TaskRow> {
  const { categoria, tags, ...rest } = body;
  return {
    ...rest,
    ...(categoria !== undefined && { categoriaId: categoria }),
    ...(tags !== undefined && { tagIds: tags }),
  };
}

@Service()
export class TaskRepository implements ITaskRepository {
  private db = inject(APP_DB);
  getAll() {
    return from(
      liveQuery(async () => {
        const rows = await this.db?.tasks.orderBy('dueDate').reverse().toArray();
        return (rows ?? []).map(rowToEntity);
      }),
    );
  }
  $getById(id: number) {
    return from(
      liveQuery(async () => {
        const row = await this.db?.tasks.get(id);
        return row ? rowToEntity(row) : undefined;
      }),
    );
  }
  async getById(id: number) {
    const row = await this.db?.tasks.get(id);
    return row ? rowToEntity(row) : undefined;
  }
  async add(body: CreateTaskEntity) {
    return (await this.db?.tasks.add(createToRow(body))) ?? 0;
  }
  async update(id: number, body: UpdateTaskEntity) {
    return (
      (await this.db?.tasks
        .where('id')
        .equals(id)
        .and((task) => !task.finished)
        .modify(updateToRow(body))) ?? 0
    );
  }
  async delete(id: number) {
    await this.db?.tasks.delete(id);
  }
}
