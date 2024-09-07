create table shopping_list_items_dg_tmp
(
  family_id             text    not null
    constraint shopping_list_items_families_family_id_fk
      references families,
  shopping_list_item_id text    not null
    constraint shopping_list_item_pk
      primary key,
  product_id            text
    constraint shopping_list_items_products_product_id_fk
      references products,
  shopping_list_id      text    not null
    constraint shopping_list_items_shopping_lists_shopping_list_id_fk
      references shopping_lists,
  is_checked            INTEGER not null,
  product_name                  TEXT
);

insert into shopping_list_items_dg_tmp(family_id, shopping_list_item_id, shopping_list_id,
                                       product_id, is_checked)
select family_id, shopping_list_item_id, shopping_list_id, product_id, is_checked
from shopping_list_items;

drop table shopping_list_items;

alter table shopping_list_items_dg_tmp
  rename to shopping_list_items;

