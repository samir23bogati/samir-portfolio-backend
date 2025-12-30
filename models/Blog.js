import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    sectionOne: {
      type: String,
      required: true,
    },
    sectionTwo: {
      type: String,
      required: true,
    },
    category: {
      type: [String],
      required: true,
      enum: ['Travel & Trekking', 'Programming', 'Technology & Development', 'Tech News & Insights'],
    },
    image: {
      type: String,
      required: false,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);
