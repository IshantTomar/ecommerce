import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'username is required'],
      unique: true,
      minlength: [3, 'username must be between 3 to 16 characters'],
      maxlength: [16, 'username must be between 3 to 16 characters'],
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      unique: true,
      match: [/\S+@\S+\.\S+/, 'Invalid email format'],
    },
    password: {
      type: String,
      required: [true, 'password is required'],
      minlength: [6, 'password must be between 6 to 16 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'seller', 'admin'],
        message: 'Role must be either user or admin',
      },
      lowercase: true,
      default: 'user',
      required: [true, 'role is required'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

const User = mongoose.model('User', userSchema);

export default User;
