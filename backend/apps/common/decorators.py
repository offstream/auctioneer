def modify_model_fields(**kwargs):
    """
    This is a MODEL decorator that will allow you to modify field properties
    i.e. fields that have been inherited from an ABSTRACT model superclass.
    WARNING! If this is used on models that INHERIT NON-ABSTRACT model
    superclasses, the superclass will also be modified.
    """

    def wrap(cls):
        for field, prop_dict in kwargs.items():
            for prop, val in prop_dict.items():
                setattr(cls._meta.get_field(field), prop, val)
        return cls

    return wrap
