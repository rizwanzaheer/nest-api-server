import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  logInsert() {
    console.log('Inserting user with id: ', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updating user with id: ', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removing user with id: ', this.id);
  }
}
