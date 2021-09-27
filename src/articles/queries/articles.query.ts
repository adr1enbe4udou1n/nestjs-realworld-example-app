import { PagedQuery } from '../../pagination';

export class ArticlesListQuery extends PagedQuery {
  author: string;

  favorited: string;

  tag: string;
}
