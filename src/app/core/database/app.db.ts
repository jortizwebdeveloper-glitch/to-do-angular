import categories from '@public/categorias.json';
import tags from '@public/tags.json';
import tasks from '@public/tasks.json';
import type { EntityTable } from 'dexie';
import Dexie from 'dexie';

import type { CategoryRow } from './schema/category.schema';
import { CATEGORIES_TABLE, CATEGORY_INDEXED } from './schema/category.schema';
import type { TagRow } from './schema/tags.schema';
import { TAG_INDEXED, TAGS_TABLE } from './schema/tags.schema';
import type { TaskRow } from './schema/task.schema';
import { TASK_INDEXED, TASKS_TABLE } from './schema/task.schema';

export class AppTaskDataBase extends Dexie {
  tasks!: EntityTable<TaskRow, 'id'>;
  categories!: EntityTable<CategoryRow, 'id'>;
  tags!: EntityTable<TagRow, 'id'>;
  constructor() {
    super('AppTaskDataBase');

    this.version(1).stores({
      [TASKS_TABLE]: TASK_INDEXED,
    });
    this.version(2).stores({
      [CATEGORIES_TABLE]: CATEGORY_INDEXED,
    });
    this.version(3).stores({
      [TAGS_TABLE]: TAG_INDEXED,
    });
    this.version(4)
      .stores({
        [TASKS_TABLE]: TASK_INDEXED,
      })
      .upgrade((tx) => {
        return tx
          .table(TASKS_TABLE)
          .toCollection()
          .modify((task) => {
            task.finished = false;
          });
      });

    this.seedTasks().then(() => {
      console.log('Seed Tasks Loaded');
    });

    this.seedCategories().then(() => {
      console.log('Seed Categories Loaded');
    });

    this.seedTags().then(() => {
      console.log('Seed Tags Loaded');
    });
  }
  private async seedTasks(force = false) {
    if (force) {
      await this.tasks.clear();
    } else {
      const count = await this.tasks.count();
      if (count > 0) return;
    }
    await this.tasks.bulkPut(tasks);
  }

  private async seedCategories(force = false) {
    if (force) {
      await this.categories.clear();
    } else {
      const count = await this.categories.count();
      if (count > 0) return;
    }
    await this.categories.bulkPut(categories);
  }

  private async seedTags(force = false) {
    if (force) {
      await this.tags.clear();
    } else {
      const count = await this.tags.count();
      if (count > 0) return;
    }
    await this.tags.bulkPut(tags);
  }
}
