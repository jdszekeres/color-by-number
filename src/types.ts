export interface Item {
    name: string;
    colors: { [key: string]: string | undefined };
    drawing: number[][];
}