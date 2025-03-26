from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm.session import Session
from fastapi import HTTPException


class CRUD:
    @staticmethod
    def add_item(db: Session, model, **kwargs):
        """Add an item to the database"""
        try:
            item = model(**kwargs)
            db.add(item)
            db.commit()
            db.refresh(item)
            return {"message": "Inserted", **kwargs}
        except SQLAlchemyError as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    @staticmethod
    def get_item(db: Session, model, item_id):
        """Retrieve an item by ID"""
        try:
            item = db.query(model).get(item_id)
            if item is None:
                raise HTTPException(status_code=404, detail=f"Item with ID {item_id} does not exist!")
            return item
        except SQLAlchemyError as e:
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
            
    @staticmethod
    def update_item(db: Session, model, item_id, **kwargs):
        """Update an item in the database"""
        try:
            item = db.query(model).get(item_id)
            if item is None:
                raise HTTPException(status_code=404, detail=f"Item with ID {item_id} does not exist!")
            
            for key, value in kwargs.items():
                setattr(item, key, value)
            
            db.commit()
            db.refresh(item)
            return {"message": "Updated", **kwargs}
        except SQLAlchemyError as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
            
    @staticmethod
    def universal_query(db: Session, base_model, attributes=None, filters=None, joins=None):
        """Flexible query function for joining and filtering models"""
        try:
            query = db.query(base_model)

            if attributes is None:
                attributes = {base_model.__tablename__: [column.name for column in base_model.__table__.columns]}

            all_models = {base_model.__tablename__.lower(): base_model}
            if joins:
                all_models.update({m.__tablename__.lower(): m for m, _ in joins})

            if joins:
                for join_model, condition in joins:
                    query = query.join(join_model, condition)

            selected_columns = []
            for table_name, cols in attributes.items():
                table_name = table_name.lower()
                model = all_models.get(table_name)
                if not model:
                    raise HTTPException(status_code=400, detail=f"Table '{table_name}' not found.")

                for col in cols:
                    if not hasattr(model, col):
                        raise HTTPException(status_code=400, detail=f"Column '{col}' not found in '{table_name}'")
                    selected_columns.append(getattr(model, col))

            print("Selected Columns:", selected_columns)  # Debugging line

            query = query.with_entities(*selected_columns)
            if filters:
                query = query.filter(*filters)

            results = query.all()
            serialized = [dict(zip([col.key for col in selected_columns], row)) for row in results]

            print("Query Output:", serialized)  # Debugging line

            return serialized
        except SQLAlchemyError as e:
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
