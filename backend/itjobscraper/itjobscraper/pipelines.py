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
                # Convert each element in the list to a string, strip whitespace, and join into a single string
                value = ' '.join(str(item).strip() for item in value)
            elif isinstance(value, tuple):
                # Convert each element of the tuple to a string and strip whitespace
                if len(value) == 1:
                    value = str(value[0]).strip()
                else:
                    value = ' '.join(str(item).strip() for item in value)
            else:
                # Convert to string and strip whitespace if it's not a list or tuple
                value = str(value).strip()
            
            adapter[field_name] = value
            
        ##remove region from location
        location_string = adapter.get('location')

        # If location_string is a tuple, convert it to a string
        if isinstance(location_string, tuple):
            location_string = ", ".join(location_string)  # Join tuple elements into a single string

        # Proceed with splitting the location string
        split_location_array = location_string.split(',')

        if len(split_location_array) == 2:
            #remove "city"
            city_name = split_location_array[0].split(" ")
            if len(city_name) == 2:
                adapter['location'] = city_name[0]
            else:
               adapter['location'] = city_name[0]   
        return item
