import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "sp_brand" })
export class SP_Brand extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type:"text"})
  brand_name: string;

  @Column()
  status: number;
}
