"""Data models."""
from . import db
from datetime import timedelta, datetime as dt

class JsonableModel:
    def as_dict(self):
        return { c.name: getattr(self, c.name) for c in self.__table__.columns }


class User(db.Model, JsonableModel):
    """Data model for user accounts."""

    __tablename__ = 'user'
    __table_args__ = {'extend_existing': True}

    id = db.Column(
        db.Integer,
        primary_key=True
    )
    username = db.Column(
        db.String(64),
        index=True,
        unique=True,
        nullable=False
    )
    email = db.Column(
        db.String(80),
        index=False,
        unique=True,
        nullable=True
    )
    password = db.Column(
        db.String(255),
        index=False,
        unique=False,
        nullable=False
    )
    isrefiller = db.Column(
        db.Boolean,
        index=False,
        unique=False,
        nullable=False,
        default=False
    )
    createdAt = db.Column(
        db.DateTime,
        index=False,
        unique=False,
        nullable=False,
        default=dt.utcnow
    )
    updatedAt = db.Column(
        db.DateTime,
        index=False,
        unique=False,
        nullable=False,
        default=dt.utcnow,
        onupdate=dt.utcnow
    )
    token = db.relationship(
        'Token',
        backref='owner',
        cascade='all, delete-orphan'
    )
    runs = db.relationship(
        'Run',
        backref='user',
        cascade='all, delete-orphan'
    )

    def __repr__(self):
        return f'<User {self.username}>'


class Token(db.Model, JsonableModel):
    __tablename__ = 'token'
    __table_args__ = {'extend_existing': True}

    id = db.Column(
        db.Integer,
        primary_key=True
    )
    code = db.Column(
        db.String(45),
        unique=True,
        nullable=False
    )
    expired_at = db.Column(
        db.DateTime(),
        unique=False,
        nullable=False,
        default=dt.utcnow() + timedelta(days=1)
    )
    user_id = db.Column(
        db.Integer,
        db.ForeignKey('user.id'),
        nullable=False
    )

    def __repr__(self):
        return f"<user {self.user_id}'s token>"


discounts = db.Table('discounts',
    db.Column('run_id', db.Integer, db.ForeignKey('run.id'), primary_key=True),
    db.Column('discount_id', db.Integer, db.ForeignKey('discount.id'), primary_key=True)
)


class Run(db.Model, JsonableModel):
    """Data model for a run."""
    __tablename__ = 'run'
    __table_args__ = {'extend_existing': True}

    id = db.Column(
        db.Integer,
        primary_key=True
    )
    startedAt = db.Column(
        db.DateTime,
        index=False,
        unique=False,
        nullable=False,
        default=dt.utcnow
    )
    endedAt = db.Column(
        db.DateTime,
        index=False,
        unique=False,
        nullable=True
    )
    duration = db.Column(
        db.Integer,
        index=False,
        unique=False,
        nullable=True
    )
    createdAt = db.Column(
        db.DateTime,
        index=False,
        unique=False,
        nullable=False,
        default=dt.utcnow
    )
    updatedAt = db.Column(
        db.DateTime,
        index=False,
        unique=False,
        nullable=False,
        default=dt.utcnow,
        onupdate=dt.utcnow
    )
    user_id = db.Column(
        db.Integer,
        db.ForeignKey('user.id'),
        nullable=False
    )
    vehicle_id = db.Column(
        db.Integer,
        db.ForeignKey('vehicle.id'),
        nullable=False
    )
    discounts = db.relationship(
        'Discount',
        secondary=discounts,
        lazy='subquery',
        backref=db.backref('runs', lazy=True)
    )

    # vehicle
    # discounts

    def __repr__(self):
        return f'<Run {self.id}>'


class Vehicle(db.Model, JsonableModel):
    """Data model for vehicle."""
    __tablename__ = 'vehicle'
    __table_args__ = {'extend_existing': True}

    id = db.Column(
        db.Integer,
        primary_key=True
    )
    battery = db.Column(
        db.Integer,
        index=False,
        unique=False,
        nullable=True
    )
    latitude = db.Column(
        db.Float,
        index=False,
        unique=False,
        nullable=True
    )
    longitude = db.Column(
        db.Float,
        index=False,
        unique=False,
        nullable=True
    )
    vehicle_type = db.Column(
        db.String(64),
        index=False,
        unique=False,
        nullable=False,
        default='trottinette'
    )
    available = db.Column(
        db.Boolean,
        index=False,
        unique=False,
        nullable=False,
        default=False
    )
    createdAt = db.Column(
        db.DateTime,
        index=False,
        unique=False,
        nullable=False,
        default=dt.utcnow
    )
    updatedAt = db.Column(
        db.DateTime,
        index=False,
        unique=False,
        nullable=False,
        default=dt.utcnow,
        onupdate=dt.utcnow
    )
    runs = db.relationship(
        'Run',
        backref='vehicle',
        cascade='all, delete-orphan'
    )

    def __repr__(self):
        return f'<Vehicle {self.id}>'


class Discount(db.Model, JsonableModel):
    """Data model for discount."""
    __tablename__ = 'discount'
    __table_args__ = {'extend_existing': True}

    id = db.Column(
        db.Integer,
        primary_key=True
    )
    name = db.Column(
        db.String(128),
        index=False,
        unique=True,
        nullable=False
    )
    value = db.Column(
        db.Float,
        index=False,
        unique=False,
        nullable=False
    )
    discount_type = db.Column(
        db.String(10),
        index=False,
        unique=False,
        nullable=False,
        default='percentage'
    )
    createdAt = db.Column(
        db.DateTime,
        index=False,
        unique=False,
        nullable=False,
        default=dt.utcnow
    )
    updatedAt = db.Column(
        db.DateTime,
        index=False,
        unique=False,
        nullable=False,
        default=dt.utcnow,
        onupdate=dt.utcnow
    )

    def __repr__(self):
        return f'<Discount {self.name}>'


