import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "dmt_material" })
export class DMTParts extends BaseEntity {
  @PrimaryGeneratedColumn()
  id : number;

  @Column()
  partNum : string;

  @Column()
  status : number;
}