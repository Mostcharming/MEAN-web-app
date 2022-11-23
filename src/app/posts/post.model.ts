// this is more like a class but it doesnt work like one it defines the how the element should be
// in this case its telling us how a post should be and what it should entail


export interface Post {
  id: string;
  title: string;
  content: string;
  imagePath: string;
  creator: string;
}
