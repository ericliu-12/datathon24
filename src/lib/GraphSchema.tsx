import mongoose, { Schema, model } from "mongoose";

export interface GraphDocument {
  _id: string;
  email: string;
  data: [
    {
      Project: String;
      Nodes: [];
      Connections: [];
      Flow: [];
    }
  ];
}

const GraphSchema = new Schema<GraphDocument>({
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
  },
  data: {
    type: [
      {
        Project: String,
        Nodes: [],
        Connections: [],
        Flow: [],
      },
    ],
    required: [true, "Json is required"],
  },
});

delete mongoose.models["Graph"];
const Graph = mongoose.models?.Graph || mongoose.model("Graph", GraphSchema);

export default Graph;
