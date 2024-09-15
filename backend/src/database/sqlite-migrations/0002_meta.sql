alter table shopping_list_items
  add _meta_updated_at timestamp;

alter table shopping_list_items
  add _meta_created_at timestamp;


select *
from shopping_list_items;
