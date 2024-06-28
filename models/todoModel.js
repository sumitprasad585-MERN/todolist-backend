const mongoose = require('mongoose');
const { default: slugify } = require('slugify');

const todoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'a todo must have a name'],
    unique: true
  },
  summary: {
    type: String,
    required: [true, 'a todo must have a summary'],
    unique: true
  },
  description: {
    type: String,
    required: [true, 'a todo must a description']
  },
  priority: {
    type: String,
    enum: {
      values: ['negligible', 'low', 'medium', 'high', 'critical'],
      message: 'Invalid value for priority: {VALUE}'
    },
    default: 'low'
  },
  status: {
    type: String,
    enum: {
      values: ['draft', 'inprogress', 'blocked', 'done', 'plannedforfuture'],
      message: 'Invalid value for status: {VALUE}'
    },
    default: 'draft'
  },
  listScore: {
    type: Number
  },
  labels: {
    type: [String]
  },
  comments: {
    type: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  slug: {
    type: String
  }
});

/** Assign a list score based on priority */
function assignListScore(document, next) {
  switch (document.priority) {
    case 'negligible':
      document.listScore = 0;
      break;
    case 'low':
      document.listScore = 1;
      break;
    case 'medium':
      document.listScore = 2;
      break;
    case 'high':
      document.listScore = 3;
      break;
    case 'critical':
      document.listScore = 4;
      break;
    default:
      document.listScore = 1;
  }

  next();
}

/** Add a pre save hook to assign a list score based on priority
 * Also, add a slug for the todo name
 */
todoSchema.pre('save', function (next) {
  /** 'this' refers to document here */
  this.slug = slugify(this.name, { lower: true });
  assignListScore(this, next);
});

/** Add a pre update hook to assign a list score based on priority */
todoSchema.pre('findOneAndUpdate', function (next) {
  /** 'this' refers to query object here */
  let update = this.getUpdate();
  assignListScore(update, next);
});

todoSchema.index({ name: 1 }, { unique: true });
todoSchema.index({ summary: 1 }, { unique: true });

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
