import { test, expect } from '@playwright/test';

const timestamp = Date.now();
const happyPathUser = {
  name: 'Tester Playwright',
  email: `happy.user-${crypto.randomUUID()}@gmail.com`,
  password: 'Password123!',
};

const user = {
  email: 'test@gmail.com',
  password: '123456',
}

const project = {
  name: 'Project ' + timestamp,
  description: 'Auto-created for E2E test',
};

const story = {
  name: 'Story ' + timestamp,
  description: 'Story for E2E',
};

const task = {
  name: 'Task ' + timestamp,
  description: 'tf',
};

test.describe('Logowanie i rejestracja', () => {

  test('rejestracja, wylogowanie i logowanie', async ({ page }) => {
    // rejestracja usera
    await page.goto('/');
    await page.getByRole('button', { name: 'Zarejestruj się' }).click();
    await expect(page.getByRole('heading', { name: 'Zarejestruj się' })).toBeVisible();

    await page.getByTestId('name-input').fill(happyPathUser.name);
    await page.getByTestId('email-input').fill(happyPathUser.email);
    await page.getByTestId('password-input').fill(happyPathUser.password);
    await page.getByRole('button', { name: 'Zarejestruj', exact: true }).click();
    
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByRole('heading', { name: /Welcome/ })).toBeVisible();

    await page.getByRole('button', { name: 'Logout' }).click(); 
    await expect(page.getByRole('heading', { name: 'Zaloguj się' })).toBeVisible();

    await page.getByTestId('email-input').fill(user.email);
    await page.getByTestId('password-input').fill(user.password);
    await page.getByRole('button', { name: 'Zaloguj', exact: true }).click();

    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByRole('heading', { name: /Welcome/ })).toBeVisible();
  });

  test('błąd logowania, error', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('email-input').fill('fakeuser@example.com');
    await page.getByTestId('password-input').fill('złeHasło123');
    await page.getByRole('button', { name: 'Zaloguj', exact: true }).click();

    await expect(page.getByText('Nieprawidłowe dane logowania')).toBeVisible();
    await expect(page).not.toHaveURL('/dashboard');
  });

  test('pełna ścieżka: logowanie, dashboard, CRUD', async ({ page }) => {
    // Logowanie
    await page.goto('/login');
    await page.getByTestId('email-input').fill(user.email);
    await page.getByTestId('password-input').fill(user.password);
    await page.getByRole('button', { name: 'Zaloguj', exact: true }).click();

    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByRole('heading', { name: /Welcome/ })).toBeVisible();

    // Dodaj projekt
    await page.getByTestId('project-name').fill(project.name);
    await page.getByTestId('project-description').fill(project.description);
    await page.getByRole('button', { name: 'Add Project' }).click();
    await expect(page.getByTestId('project-list').getByText(project.name)).toBeVisible();
    await page.getByText(project.name).click();

    // Dodaj story
    await page.getByTestId('story-name').fill(story.name);
    await page.getByTestId('story-description').fill(story.description);
    await page.getByRole('button', { name: 'Add Story' }).click();
    await expect(page.getByText(story.name)).toBeVisible();
    await page.getByText(story.name).click();

    // Dodaj task
    await page.getByTestId('task-name').fill(task.name);
    await page.getByTestId('task-description').fill(story.description);
    await page.getByRole('button', { name: 'Add Task' }).click();
    await expect(page.getByTestId('task-list').getByText(task.name)).toBeVisible();

    // Przeciągnij task do "doing"
    // const taskBacklog = page.locator('[data-testid="task-backlog"]', { hasText: task.name });
    // const columnDoing = page.getByRole('heading', { name: 'Doing' }).locator('..');
    // await taskBacklog.dragTo(columnDoing);
    // await expect(columnDoing.getByText(task.name)).toBeVisible();

    // Usun task
    // const taskInDoing = columnDoing.locator('[data-testid="task-id"]', { hasText: task.name });
    // await taskInDoing.locator('[data-testid="task-backlog"]').click();
    // await expect(taskInDoing).toHaveCount(0);

    await page.getByRole('button', { name: 'Logout' }).click();
    await expect(page.getByRole('heading', { name: 'Zaloguj się' })).toBeVisible();
  });
});