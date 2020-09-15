export const data = {
  id: 'simple-task-v1',
  title: 'Simple task',
  author: 'cardamo',
  state: 'DRAFT', // enum [DRAFT, PUBLISHED, ARCHIVED]
  categoriesOrder: ['Basic Scope', 'Extra Scope', 'Fines'],
  items: [
    {
      id: 'basic_p1',
      minScore: 0,
      maxScore: 20,
      category: 'Basic Scope',
      title: 'Basic things',
      description: 'You need to make things right, not wrong',
    },
    {
      id: 'extra_p1',
      minScore: 0,
      maxScore: 30,
      category: 'Extra Scope',
      title: 'More awesome things',
      description: 'Be creative and make up some more awesome things',
    },
    {
      id: 'fines_p1',
      minScore: -10,
      maxScore: 0,
      category: 'Fines',
      title: 'App crashes',
      description: 'App causes BSoD!',
    },
  ],
};
