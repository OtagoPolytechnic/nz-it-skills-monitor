# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from itemadapter import ItemAdapter
from itertools import chain

class ItjobscraperPipeline:
    def process_item(self, item, spider):
        
        adapter = ItemAdapter(item)
        
        ##turn description into one string, removes encoded characters, to lower
        description_array = adapter.get('description')
        flat_description = list(chain.from_iterable(description_array))
        full_description = " ".join(flat_description)
        full_description.replace("\n", "")
        adapter['description'] = full_description.lower()       
        
        #strip white space, and convert to string
        field_names = adapter.field_names()

        for field_name in field_names:
            value = adapter.get(field_name)
            
            if isinstance(value, list):
                value = ' '.join(str(item).strip() for item in value)
            elif isinstance(value, tuple):
                if len(value) == 1:
                    value = str(value[0]).strip()
                else:
                    value = ' '.join(str(item).strip() for item in value)
            else:
                value = str(value).strip()
            
            adapter[field_name] = value
            
        ##remove region from location
        location_string = adapter.get('location')

        if isinstance(location_string, tuple):
            location_string = ", ".join(location_string)  

        split_location_array = location_string.split(',')

        if len(split_location_array) == 2:
            #remove "city"
            city_name = split_location_array[0].split(" ")
            if len(city_name) == 2:
                adapter['location'] = city_name[0]
            else:
               adapter['location'] = city_name[0]   
        return item
