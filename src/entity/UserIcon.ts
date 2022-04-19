import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity({ name: "user_icon" })
export class UserIcon extends BaseEntity {
  @PrimaryGeneratedColumn()
  id : number;

  @Column()
  user_id : number;

  @OneToOne(type => User, user => user.userIcon)
  @JoinColumn({ name: "user_id", referencedColumnName: "id"})
  user : User

  @Column()
  accessory : string;

  @Column()
  body : string;

  @Column()
  circleColor : string;

  @Column()
  clothing : string;

  @Column()
  clothingColor : string;

  @Column()
  eyebrows : string;

  @Column()
  eyes : string;

  @Column()
  facialHair : string;
  
  @Column()
  graphic : string;

  @Column()
  hair : string;

  @Column()
  hairColor : string;

  @Column()
  hat : string;

  @Column()
  hatColor : string;

  @Column()
  lashes : string;

  @Column()
  lipColor : string;

  @Column()
  mask : string;

  @Column()
  faceMask : string;

  @Column()
  mouth : string;

  @Column()
  skinTone : string;

  @Column()
  faceMaskColor : string;

  @Column()
  status : number;
}