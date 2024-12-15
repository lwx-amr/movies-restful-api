import * as _ from 'lodash';
import { User } from '../entities/user.entity';
import { User as UserType } from '../types/user.type';

export class UserView {
  constructor(private readonly data: User | User[]) {}

  render() {
    if (Array.isArray(this.data)) {
      return this.data.map((user) => this.renderUser(user));
    }
    return this.renderUser(this.data);
  }

  renderUser(user: User): UserType {
    const userData = _.pick(user, ['id', 'username', 'fullName', 'createdAt']);
    return userData;
  }
}
